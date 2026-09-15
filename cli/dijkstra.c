#include <stdio.h>

#define MAX 20
#define INF 9999

int ROWS, COLS;

char grid[MAX][MAX];

int distance[MAX][MAX];
int visited[MAX][MAX];

int parentRow[MAX][MAX];
int parentCol[MAX][MAX];

int startRow, startCol;
int endRow, endCol;

int dr[] = {-1, 1, 0, 0};
int dc[] = {0, 0, -1, 1};

int dfsVisited[MAX][MAX];
int routeCount = 0;
int maxRoutes = 0;
char routeGrid[MAX][MAX];

void inputGridSize()
{
    printf("Enter number of rows: ");
    scanf("%d", &ROWS);

    printf("Enter number of columns: ");
    scanf("%d", &COLS);
}

void inputGrid()
{
    int i, j;

    printf("\nEnter grid values:\n");
    printf("Use:\n");
    printf(". for free path\n");
    printf("X for obstacle\n");
    printf("S for start\n");
    printf("D for destination\n\n");

    for(i = 0; i < ROWS; i++)
    {
        for(j = 0; j < COLS; j++)
        {
            scanf(" %c", &grid[i][j]);
        }
    }
}

void findStartAndDestination()
{
    int i, j;

    for(i = 0; i < ROWS; i++)
    {
        for(j = 0; j < COLS; j++)
        {
            if(grid[i][j] == 'S')
            {
                startRow = i;
                startCol = j;
            }

            if(grid[i][j] == 'D')
            {
                endRow = i;
                endCol = j;
            }
        }
    }
}

void initializeArrays()
{
    int i, j;

    for(i = 0; i < ROWS; i++)
    {
        for(j = 0; j < COLS; j++)
        {
            distance[i][j] = INF;
            visited[i][j] = 0;

            parentRow[i][j] = -1;
            parentCol[i][j] = -1;
        }
    }

    distance[startRow][startCol] = 0;
}

void printGrid()
{
    int i, j;

    printf("\nShortest Path Grid:\n\n");

    for(i = 0; i < ROWS; i++)
    {
        for(j = 0; j < COLS; j++)
        {
            printf("%c ", grid[i][j]);
        }

        printf("\n");
    }
}

void findMinimumCell(int *minRow, int *minCol)
{
    int i, j;

    int min = INF;

    *minRow = -1;
    *minCol = -1;

    for(i = 0; i < ROWS; i++)
    {
        for(j = 0; j < COLS; j++)
        {
            if(visited[i][j] == 0 &&
               distance[i][j] < min &&
               grid[i][j] != 'X')
            {
                min = distance[i][j];

                *minRow = i;
                *minCol = j;
            }
        }
    }
}

void updateNeighbors(int row, int col)
{
    int i;

    for(i = 0; i < 4; i++)
    {
        int newRow = row + dr[i];
        int newCol = col + dc[i];

        if(newRow >= 0 &&
           newRow < ROWS &&
           newCol >= 0 &&
           newCol < COLS)
        {
            if(grid[newRow][newCol] != 'X' &&
               visited[newRow][newCol] == 0)
            {
                int newDistance = distance[row][col] + 1;

                if(newDistance < distance[newRow][newCol])
                {
                    distance[newRow][newCol] = newDistance;

                    parentRow[newRow][newCol] = row;
                    parentCol[newRow][newCol] = col;
                }
            }
        }
    }
}

void dijkstra()
{
    int count;

    for(count = 0; count < ROWS * COLS; count++)
    {
        int row, col;

        findMinimumCell(&row, &col);

        if(row == -1 || col == -1)
        {
            break;
        }

        visited[row][col] = 1;

        updateNeighbors(row, col);
    }
}

void markPath(int endRow, int endCol)
{
    int row = endRow;
    int col = endCol;

    while(parentRow[row][col] != -1 &&
          parentCol[row][col] != -1)
    {
        if(grid[row][col] != 'D')
        {
            grid[row][col] = '*';
        }

        int tempRow = parentRow[row][col];
        int tempCol = parentCol[row][col];

        row = tempRow;
        col = tempCol;
    }
}

void copyGrid()
{
    int i,j;

    for(i=0;i<ROWS;i++)
    {
        for(j=0;j<COLS;j++)
        {
            routeGrid[i][j] = grid[i][j];
        }
    }
}

void printRouteGrid()
{
    int i,j;

    for(i=0;i<ROWS;i++)
    {
        for(j=0;j<COLS;j++)
        {
            printf("%c ", routeGrid[i][j]);
        }

        printf("\n");
    }
}

void dfs(int row,int col,int steps)
{
    int i;

    if(routeCount >= maxRoutes)
        return;

    if(row == endRow && col == endCol)
    {
        routeCount++;

        printf("\nROUTE %d\n",routeCount);

        printf("Distance = %d\n\n",steps);

        printRouteGrid();

        return;
    }

    dfsVisited[row][col] = 1;

    for(i=0;i<4;i++)
    {
        int newRow = row + dr[i];
        int newCol = col + dc[i];

        if(newRow >= 0 &&
           newRow < ROWS &&
           newCol >= 0 &&
           newCol < COLS)
        {
            if(grid[newRow][newCol] != 'X' &&
               dfsVisited[newRow][newCol] == 0)
            {
                if(grid[newRow][newCol] != 'D')
                {
                    routeGrid[newRow][newCol] = '*';
                }

                dfs(newRow,newCol,steps+1);

                if(grid[newRow][newCol] != 'D')
                {
                    routeGrid[newRow][newCol] =
                    grid[newRow][newCol];
                }
            }
        }
    }

    dfsVisited[row][col] = 0;
}

void showPossibleRoutes()
{
    int i,j;

    routeCount = 0;

    printf("\nHow many possible routes do you want to see? ");
    scanf("%d", &maxRoutes);

    for(i=0;i<ROWS;i++)
    {
        for(j=0;j<COLS;j++)
        {
            dfsVisited[i][j] = 0;
        }
    }

    copyGrid();

    dfs(startRow,startCol,0);
}

int main()
{
    printf("====================================\n");
    printf(" DRONE DELIVERY PATH PLANNER\n");
    printf(" USING DIJKSTRA ALGORITHM\n");
    printf("====================================\n");

    inputGridSize();

    inputGrid();

    findStartAndDestination();

    showPossibleRoutes();

    printf("\n--- Showing top %d possible route(s) ---\n", maxRoutes);

    initializeArrays();

    dijkstra();

    if(distance[endRow][endCol] == INF)
    {
        printf("\nNo Path Found!\n");

        return 0;
    }

    markPath(endRow, endCol);

    printGrid();

    printf("\nShortest Distance = %d\n",
           distance[endRow][endCol]);

    return 0;
}
