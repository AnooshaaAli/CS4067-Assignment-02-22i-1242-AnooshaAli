## -------------------- ##
##    Anoosha Ali       ##
##     22i-1242         ##
##        J             ##
## -------------------- ##

### ----------------------------------------- Assumptions ------------------------------------- ##

## 1. The first row of data file is num of cols.
## 2. Num of rows is the count of the number of lines.
## 3. Collision of start and goal of a robot with the obstacle, overwrite the obstacle.
## 4. Collision of agent with the obstacle, prioritize the obstacle.

## ------------------------------------------ The Code --------------------------------------- ##

import pandas as pd
import numpy as np
import re
import queue
from collections import deque
import heapq
import copy
import random

## colors
RESET = "\033[0m" 
BLACK = "\033[30m"    
RED = "\033[31m"      
GREEN = "\033[32m"    
YELLOW = "\033[33m"    
BLUE = "\033[34m"     
MAGENTA = "\033[35m"  
CYAN = "\033[36m"      
WHITE = "\033[37m" 

BRIGHT_BLACK = "\033[90m"
BRIGHT_RED = "\033[91m"
BRIGHT_GREEN = "\033[92m"
BRIGHT_YELLOW = "\033[93m"
BRIGHT_BLUE = "\033[94m"
BRIGHT_MAGENTA = "\033[95m"
BRIGHT_CYAN = "\033[96m"
BRIGHT_WHITE = "\033[97m"

## clear agent previous position
def clear_agent_prev_pos(time, agent, matrix, agent_idx):
    if agent['forward']:  
        path_to_check = agent['agent_path_backward']
    else:  
        path_to_check = agent['agent_path_forward']

    if path_to_check:  
        x, y = path_to_check[-1]  # Get the last position in the respective path
        if matrix[x][y] == f"{RED}A{agent_idx}{RESET}":
            matrix[x][y] = ". "

## clear robot previous position
def clear_robot_prev_pos(time, robot, matrix, path):
    if time > 0:
        x, y = path[time - 1]
        if (matrix[x][y] == f"{YELLOW}S{robot['id']}{RESET}"): 
            matrix[x][y] = ". "

## finds manhanttan distance
def heuristic(x, y, goal):
    # Manhattan distance heuristic
    return abs(x - goal[0]) + abs(y - goal[1])

## get agents position
def update_agent_position(time, agent, agent_idx, matrix):
    if agent['forward']:
        #print("At time: ", time)
        if time in agent or agent['agent_path_forward']:
            if agent['agent_path_forward']:
                #print(agent['agent_path_forward'])
                x, y = agent['agent_path_forward'].pop()
                agent['agent_path_backward'].append((x, y))
                if not agent['agent_path_forward']:
                    nx, ny = agent['agent_path_backward'].pop() 
                    agent['agent_path_forward'].append((nx, ny))
                    agent['forward'] = False 
            else:       
                x, y = agent[time]
                agent['agent_path_backward'].append((x, y))
                if time + 1 not in agent:
                    nx, ny = agent['agent_path_backward'].pop()
                    agent['agent_path_forward'].append((nx, ny))
                    agent['forward'] = False 

            if matrix[x][y] != ". ":
                #print(f"Collision detected for agent {agent_idx + 1} at time {time}\n") 
                return -1, -1
            else:
                return x, y
        else:
            if agent['agent_path_backward']:
                x, y = agent['agent_path_backward'].pop() 
                agent['agent_path_forward'].append((x, y))
                agent['forward'] = False  
    
    elif not agent['forward'] and agent['agent_path_backward']:
        x, y = agent['agent_path_backward'].pop()
        if agent['agent_path_backward']:
            agent['agent_path_forward'].append((x, y))
        else:
            agent['forward'] = True
            agent['agent_path_backward'].append((x, y))
        if matrix[x][y] != ". ":
            #print(f"Collision detected for agent {agent_idx + 1} at time {time}\n")
            return -1, -1
        else:
            return x, y

    if not agent['agent_path_backward']:  
        if agent['agent_path_forward']:
            x, y = agent['agent_path_forward'].pop() 
            agent['agent_path_backward'].append((x, y))
            agent['forward'] = True
            
    return -1, -1

## a star search algorithm
def a_star_search(matrix, robots, agents_list):

    occupied_positions = set()
    
    for robot in robots:
        occupied_positions.add((robot["start"]))
        occupied_positions.add((robot["goal"]))
        
    potential_paths = {robot["id"]: [] for robot in robots}
    
    for robot in robots:  
        occupied_positions.remove((robot["goal"]))
        x, y = robot["start"]
        goal = robot["goal"]
        path = [(x, y)]
        # (f(n), g(n), x, y, path)
        priority_queue = [(0 + heuristic(x, y, goal), 0, x, y, path)]  
        g_costs = {robot["start"]: 0} 
        closed_list = set()  
        
        while priority_queue:
            _, g_cost, cx, cy, current_path = heapq.heappop(priority_queue)  

            if (cx, cy) == goal:
                potential_paths[robot["id"]] = current_path
                occupied_positions.add((robot["goal"]))
                break

            closed_list.add((cx, cy))  
            time = len(current_path)
            
            for agent_idx, agent in enumerate(agents_list):
                clear_agent_prev_pos(time, agent, matrix, agent_idx + 1) 
                ax, ay = update_agent_position(time, agent, agent_idx, matrix)
                if (ax != -1 and ay != -1) and (ax, ay) not in occupied_positions:
                    occupied_positions.add((ax, ay))

            possible_moves = [(0, 1), (1, 0), (0, -1), (-1, 0)]
            random.shuffle(possible_moves)
            
            for dx, dy in possible_moves:
                nx, ny = cx + dx, cy + dy
                new_g_cost = g_cost + 1
                
                if (
                    0 <= nx < len(matrix) and 0 <= ny < len(matrix[0]) and 
                    (nx, ny) not in closed_list and 
                    (nx, ny) not in occupied_positions and 
                    (matrix[nx][ny] != "X ")
                ):                             
                    f_cost = new_g_cost + heuristic(nx, ny, goal)
                    if (nx, ny) not in g_costs or new_g_cost < g_costs[(nx, ny)]:
                        g_costs[(nx, ny)] = new_g_cost
                        heapq.heappush(priority_queue, (f_cost, new_g_cost, nx, ny, current_path + [(nx, ny)]))

            for agent_idx, agent in enumerate(agents_list):
                clear_agent_prev_pos(time, agent, matrix, agent_idx + 1) 
                ax, ay = update_agent_position(time, agent, agent_idx, matrix)
                if (ax != -1 and y != -1) and (ax, ay) in occupied_positions:
                    occupied_positions.remove((ax, ay))
            
    return potential_paths

## detect collision between two robots
def detect_collision(cx, cy, potential_paths, time):
    for path in potential_paths.values():
        if time < len(path) and path[time] == (cx, cy):
            return True
            
    return False

# a star serach with handling collisions
def a_star_search_with_collision(matrix, robots, agents_list):

    occupied_positions = set()
    
    for robot in robots:
        occupied_positions.add((robot["start"]))
        occupied_positions.add((robot["goal"]))
        
    potential_paths = {robot["id"]: [] for robot in robots}
    
    for robot in robots:  
        occupied_positions.remove((robot["goal"]))
        x, y = robot["start"]
        goal = robot["goal"]
        path = [(x, y)]
        # (f(n), g(n), x, y, path)
        priority_queue = [(0 + heuristic(x, y, goal), 0, x, y, path)]  
        g_costs = {robot["start"]: 0} 
        closed_list = set()  
        
        while priority_queue:
            _, g_cost, cx, cy, current_path = heapq.heappop(priority_queue)  

            if (cx, cy) == goal:
                potential_paths[robot["id"]] = current_path
                occupied_positions.add((robot["goal"]))
                break
            
            closed_list.add((cx, cy))  
            time = len(current_path)
            
            if detect_collision(cx, cy, potential_paths, time - 1):
                for robot_id, path in potential_paths.items():
                    if len(path) > 1 and path[-1] == (cx, cy):
                        previous_position = path[-2]  
                        path.append((cx, cy)) 
                        path.append(previous_position)  
                        print(f"Collision detected at {cx, cy} for Robot {robot_id}. Reverting to {previous_position} and retrying.")
                continue  

            
            for agent_idx, agent in enumerate(agents_list):
                clear_agent_prev_pos(time, agent, matrix, agent_idx + 1) 
                ax, ay = update_agent_position(time, agent, agent_idx, matrix)
                if (ax != -1 and ay != -1) and (ax, ay) not in occupied_positions:
                    occupied_positions.add((ax, ay))

            possible_moves = [(0, 1), (1, 0), (0, -1), (-1, 0)]
            random.shuffle(possible_moves)
            
            for dx, dy in possible_moves:
                nx, ny = cx + dx, cy + dy
                new_g_cost = g_cost + 1
                
                if (
                    0 <= nx < len(matrix) and 0 <= ny < len(matrix[0]) and 
                    (nx, ny) not in closed_list and 
                    (nx, ny) not in occupied_positions and 
                    (matrix[nx][ny] != "X ")
                ):                             
                    f_cost = new_g_cost + heuristic(nx, ny, goal)
                    if (nx, ny) not in g_costs or new_g_cost < g_costs[(nx, ny)]:
                        g_costs[(nx, ny)] = new_g_cost
                        heapq.heappush(priority_queue, (f_cost, new_g_cost, nx, ny, current_path + [(nx, ny)]))

            for agent_idx, agent in enumerate(agents_list):
                clear_agent_prev_pos(time, agent, matrix, agent_idx + 1) 
                ax, ay = update_agent_position(time, agent, agent_idx, matrix)
                if (ax != -1 and y != -1) and (ax, ay) in occupied_positions:
                    occupied_positions.remove((ax, ay))
            
    return potential_paths
    
## reading the data file
with open("Data/data0.txt", 'r') as file:
    data0 = file.readline().strip().split()
    num_cols = int(data0[0])
    num_rows = 0
    matrix_list = []
    
    ## read the file row by row
    for line in file:
        num_rows += 1
        elements = []  

        j = 0
        while j < len(line):
            pair = line[j:j+2]

            if pair == "  ":
                elements.append(". ")
            elif pair == "X ":
                elements.append("X ")

            j += 2  

        matrix_list.append(elements)

matrix = np.array([row + ['. '] * (num_cols - len(row)) for row in matrix_list], dtype='object')

## the robots 
robots = []
with open("Data/Robots0.txt", "r") as file:
    for line in file:
        parts = re.findall(r"\d+", line)  

        ## check that there is no obstacle there
        if (matrix[int(parts[1]), int(parts[2])] == ". " and matrix[int(parts[3]), int(parts[4])] == ". "):
            matrix[int(parts[1]), int(parts[2])] = f"{YELLOW}S{parts[0]}{RESET}"
            matrix[int(parts[3]), int(parts[4])] = f"{GREEN}G{parts[0]}{RESET}"
        else: 
            print(f"Collision Detected for Robot {parts[0]}\n")
            matrix[int(parts[1]), int(parts[2])] = f"{YELLOW}S{parts[0]}{RESET}"
            matrix[int(parts[3]), int(parts[4])] = f"{GREEN}G{parts[0]}{RESET}"
            
        start = (int(parts[1]), int(parts[2]))
        goal = (int(parts[3]), int(parts[4]))
        robots.append({"id": parts[0], "start": start, "goal": goal, "path": []})

## the agents
agents_list = []
with open("Data/Agent0.txt", "r") as file:
    for line in file:

        ## store the rows in a list
        parts = re.findall(r"\d+", line)
        idx = int(parts[0])
        parts.remove(parts[0])

        ## dividing the list into three equal parts and then concatenating part 1 and part 2
        third = len(parts) // 3
        positions = parts[:2*third]
        times = parts[2*third:]
        
        dict_agent = {
            int(times[i // 2]): (int(positions[i]), int(positions[i + 1])) 
            for i in range(0, len(positions), 2)
        }
        dict_agent["forward"] = True  
        dict_agent["agent_path_forward"] = []
        dict_agent["agent_path_backward"] = []
        agents_list.append(dict_agent)

# find potential paths
paths = []
agents_list_temp = copy.deepcopy(agents_list)
paths = a_star_search_with_collision(matrix, robots, agents_list_temp)

max_time_taken = 0
for robot in robots:
    print(f"Robot {robot['id']} Path: {paths[robot['id']]}")
    max_time_taken = max(max_time_taken, (len(paths[robot['id']]) - 1))
    print(f"Robot {robot['id']} Total Time: {len(paths[robot['id']]) - 1}")

# Simulate the agent and robots movement
time = 0
while time <= max_time_taken:
    print(f"\nPositions at t = {time}\n") 
    
    for agent_idx, agent in enumerate(agents_list):
        clear_agent_prev_pos(time, agent, matrix, agent_idx + 1) 
        x, y = update_agent_position(time, agent, agent_idx, matrix)
        if (x != -1 and y != -1):
            matrix[x][y] = f"{RED}A{agent_idx + 1}{RESET}"
            
    for robot in robots:
        path = paths[robot['id']]
        if time == (len(path) - 1):
            clear_robot_prev_pos(time, robot, matrix, path)
            nx, ny = path[time]
            matrix[nx][ny] = f"{MAGENTA}S{robot['id']}{RESET}"
        elif time < (len(path) - 1):
            clear_robot_prev_pos(time, robot, matrix, path)
            nx, ny = path[time]
            matrix[nx][ny] = f"{YELLOW}S{robot['id']}{RESET}"
                
    for row in matrix:
        print(" ".join(row))

    time += 1

## store in file the robots path
max_time_taken = 0
with open("simulation_output.txt", "w") as file:  # Open the file for writing
    for robot in robots:
        file.write(f"Robot {robot['id']} Path: {paths[robot['id']]}\n")
        max_time_taken = max(max_time_taken, (len(paths[robot['id']]) - 1))
        file.write(f"Robot {robot['id']} Total Time: {len(paths[robot['id']]) - 1}\n")
